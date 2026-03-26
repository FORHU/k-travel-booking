import fs from 'fs';

async function run() {
    const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfa2V5IjoiMzZiNDk4OTc0MzJmOWRhODFiZWUyMDJmNTk4NmYxMjRjZDg4ZDkwNjE3NGNkMDU1ZTAzNWI0ZTljYjk2MjkzYyIsInRpbWVzdGFtcCI6MTcxNjc3MjQ1MTUyNywic2VydmljZV9pZCI6MSwidGFyZ2V0IjoiY2hhbm5lbCIsInRhcmdldF9pZCI6MSwiaWF0IjoxNzE2NzcyNDUxLCJleHAiOjE3Nzk4NDQ0NTF9.JbsXGKNrTXF9bq5LolaRQJa1o6YjS31PxInfKKf4sfA";
    
    console.log("Fetching /properties/100289 (Seoul Best Stay)...");
    const contentRes = await fetch(`https://dapi.tport.dev/gds/diglett/properties/100289`, {
         headers: { "Authorization": key }
    });
    console.log("Content HTTP status:", contentRes.status);
    const contentData = await contentRes.json();
    console.log("Seoul Best Stay content:", JSON.stringify(contentData, null, 2));

}
run().catch(console.error);
