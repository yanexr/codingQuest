import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const url =
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&fields=*";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      },
      body: req.body,
    };

    try {
      let response = await fetch(url, options);
      let postSubmission = await response.json();
      res.status(200).json(postSubmission);
    } catch (error) {
      res.status(400).json({ error: "Bad Request" });
    }
  } else if (req.method === "GET") {
    try {
      const token = req.query.token;
      const url =
        "https://judge0-ce.p.rapidapi.com/submissions/" +
        token +
        "?base64_encoded=false&fields=*";
      const options = {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      };
      let response = await fetch(url, options);
      let getSubmission = await response.json();
      res.status(200).json(getSubmission);
    } catch (error) {
      res.status(400).json({ error: "Bad Request" });
      console.log(error);
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
