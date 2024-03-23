import * as dotenv from "dotenv";
import * as oauth2 from "./oauth2.keys.json";

dotenv.config();

const config = oauth2.web;

export { config };
