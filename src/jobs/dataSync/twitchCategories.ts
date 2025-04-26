import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Op } from "sequelize";
import { s3 as s3Config } from "../../config";
import { StreamCategory } from "../../models";

const s3 = new S3Client(s3Config.client);

type TwitchGamesTopResponse = {
  pagination: {
    cursor: string;
  };
  data: {
    id: string;
    name: string;
    box_art_url: string;
    igdb_id: string;
  }[];
};

const getGames = async (
  pagination: TwitchGamesTopResponse["pagination"]
): Promise<TwitchGamesTopResponse> => {
  const url = new URL("https://api.twitch.tv/helix/games/top");

  // build query parameters
  const qp = new URLSearchParams();
  qp.append("first", "100");
  if (pagination.cursor && pagination.cursor !== "") {
    qp.append("after", pagination.cursor);
  }
  url.search = qp.toString();

  // make request to Twitch API
  const res = await fetch(url.toString(), {
    headers: {
      Authorization: "",
      "Client-Id": "",
    },
  });

  // check the response code
  if (!res.ok) {
    console.warn(`Twitch Top Games unexpected response code: ${res.status}`);
    return { data: [], pagination: { cursor: "" } };
  }

  // parse json
  const body = (await res.json()) as TwitchGamesTopResponse;
  return body;
};

const syncPoster = async (categoryId: string, url: string) => {
  // process url (https://static-cdn.jtvnw.net/ttv-boxart/493057-{width}x{height}.jpg)
  url = url.replace("{width}", "300").replace("{height}", "400");
  if (url.split(".").pop() !== "jpg") {
    console.warn(`Unexpected file ext: ${url.split(".").pop()}`, url);
    return;
  }

  // create read stream from twitch cdn
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`Invalid response, code=${res.status} for ${url}`);
    return;
  }
  if (!res.bodyUsed || res.body === null) {
    console.warn(`Invalid response, missing body for ${url}`);
    return;
  }

  // write stream to s3
  s3.send(
    new PutObjectCommand({
      Bucket: s3Config.buckets.assets,
      Key: `category-posters/${categoryId}.jpg`,
      Body: res.body,
    })
  );
};

export const twitchCategoriesJobName = "twitch-categories";

export const twitchCategoriesJob = async () => {
  let hasMore: boolean = true;
  let pagination: TwitchGamesTopResponse["pagination"] = { cursor: "" };
  const knownIds: string[] = [];

  // get games from twitch and insert into db
  while (hasMore) {
    const res = await getGames(pagination);
    pagination = res.pagination;
    hasMore = !!pagination?.cursor;

    // keep track of known IDs
    for (const game of res.data) {
      knownIds.push(game.id);
    }

    if (res.data.length > 0) {
      // insert into DB
      const newCategories = res.data.map((game) => ({
        name: game.name,
        twitch_id: game.id,
        igdb_id: game.igdb_id,
      }));
      await StreamCategory.bulkCreate(newCategories, {
        ignoreDuplicates: true,
      });

      // sync the posters
      const categories = await StreamCategory.findAll({
        where: {
          twitch_id: {
            [Op.in]: res.data.map((game) => game.id),
          },
        },
      });
      await Promise.all(
        categories.map((category) =>
          syncPoster(
            category.id,
            res.data.find((game) => game.id === category.twitch_id)!.box_art_url
          )
        )
      );
    }
  }

  // cleanup old games
  await StreamCategory.update(
    { twitch_id: null },
    {
      where: {
        twitch_id: {
          [Op.notIn]: knownIds,
          [Op.ne]: null,
        },
      },
    }
  );
};
