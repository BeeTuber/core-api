import axios, { AxiosInstance } from "axios";
import { TwitchSecret } from "../../types";
import {
  ModifyChannelInformationParams,
  ModifyChannelInformationResponse,
} from "./modifyChannelInformation";

export class TwitchClient {
  #http: AxiosInstance;

  constructor({
    secret,
    baseUrl = "https://api.twitch.tv/helix",
  }: {
    secret: TwitchSecret;
    baseUrl?: string;
  }) {
    this.#http = axios.create({ baseURL: baseUrl });
  }

  /**
   * Updates a channel’s properties.
   *
   * Requires a user access token that includes the `channel:manage:broadcast` scope.
   *
   * Twitch docs: {@link https://dev.twitch.tv/docs/api/reference/#modify-channel-information}
   */
  public async modifyChannelInformation(
    params: ModifyChannelInformationParams
  ): Promise<ModifyChannelInformationResponse> {
    const res = await this.#http.patch("/channels", params);
    if (res.status !== 200) {
      throw new Error();
    }
    return JSON.parse(await res.data);
  }
}
