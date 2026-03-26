import fs from 'fs';

async function run() {
    const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfa2V5IjoiMzZiNDk4OTc0MzJmOWRhODFiZWUyMDJmNTk4NmYxMjRjZDg4ZDkwNjE3NGNkMDU1ZTAzNWI0ZTljYjk2MjkzYyIsInRpbWVzdGFtcCI6MTcxNjc3MjQ1MTUyNywic2VydmljZV9pZCI6MSwidGFyZ2V0IjoiY2hhbm5lbCIsInRhcmdldF9pZCI6MSwiaWF0IjoxNzE2NzcyNDUxLCJleHAiOjE3Nzk4NDQ0NTF9.JbsXGKNrTXF9bq5LolaRQJa1o6YjS31PxInfKKf4sfA";
    
    const searchParams = new URLSearchParams();
    searchParams.append("checkin", "2026-05-01");
    searchParams.append("checkout", "2026-05-04");
    searchParams.append("adult", "2");
    // "100289" is Seoul Best Stay
    searchParams.append("property_id[]", "100289");

    const searchRes = await fetch("https://dapi.tport.dev/gds/diglett/search/properties?" + searchParams.toString(), {
        headers: { "Authorization": key }
    });

    console.log("Search HTTP status:", searchRes.status);
    const searchData = await searchRes.json();
    console.log("Search response:", JSON.stringify(searchData, null, 2));
}
run().catch(console.error);
