import { connect } from "mongoose";
import env from "./config/config.js"

export default connect(env.MONGO_URL)