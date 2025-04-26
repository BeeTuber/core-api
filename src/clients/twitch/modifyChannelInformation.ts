import { ContentClassificationLabel } from "./types";

export type ModifyChannelInformationParams = {
  game_id?: string;
  broadcaster_language?: string;
  title?: string;
  delay?: number;
  tags?: string[];
  content_classification_label?: ContentClassificationLabel[];
  is_branded_content?: boolean;
};

export type ModifyChannelInformationResponse = {};


