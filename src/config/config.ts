import dotenv from 'dotenv'

dotenv.config()

const TOKEN_SECRET=process.env.TOKEN_KEY || "assafKatz99";


const config={
    secretKey:TOKEN_SECRET
}
export default config;