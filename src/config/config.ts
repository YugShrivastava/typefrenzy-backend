import { configDotenv } from "dotenv";

configDotenv()

interface EnvironmentVariables  {
    PORT: string,
    MONGO_URL: string,
    ABSTRACT_API_KEY: string,
    JWT_SECRET: string
}

const getEnv = (): EnvironmentVariables => {
    const {PORT, MONGO_URL, ABSTRACT_API_KEY, JWT_SECRET} = process.env;

    if(!PORT || !MONGO_URL || !ABSTRACT_API_KEY || !JWT_SECRET){
        throw new Error("Environment variables missing!!!")
    }

    return {
        PORT,
        MONGO_URL,
        ABSTRACT_API_KEY,
        JWT_SECRET
    }
}

const env = getEnv();

export default env