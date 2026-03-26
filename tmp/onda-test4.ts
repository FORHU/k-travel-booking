import fs from 'fs';

async function run() {
    const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfa2V5IjoiMzZiNDk4OTc0MzJmOWRhODFiZWUyMDJmNTk4NmYxMjRjZDg4ZDkwNjE3NGNkMDU1ZTAzNWI0ZTljYjk2MjkzYyIsInRpbWVzdGFtcCI6MTcxNjc3MjQ1MTUyNywic2VydmljZV9pZCI6MSwidGFyZ2V0IjoiY2hhbm5lbCIsInRhcmdldF9pZCI6MSwiaWF0IjoxNzE2NzcyNDUxLCJleHAiOjE3Nzk4NDQ0NTF9.JbsXGKNrTXF9bq5LolaRQJa1o6YjS31PxInfKKf4sfA";
    
    // Attempt standard /properties with query args
    const urls = [
        "https://dapi.tport.dev/gds/diglett/properties?expand=images,facilities",
        "https://dapi.tport.dev/gds/diglett/properties?include=content",
        "https://dapi.tport.dev/gds/diglett/properties?with_content=true"
    ];

    for (const url of urls) {
        console.log(`Fetching ${url}...`);
        const res = await fetch(url, { headers: { "Authorization": key } });
        const data = await res.json();
        const p = (data.properties || data.data)?.[0];
        console.log(`Response keys for first property: ${p ? Object.keys(p).join(", ") : 'none'}`);
    }

    // Try a broad search 
    console.log("Searching availability with no property_ids...");
    const searchParams = new URLSearchParams();
    searchParams.append("checkin", "2026-04-01");
    searchParams.append("checkout", "2026-04-04");
    searchParams.append("adult", "2");

    const searchRes = await fetch("https://dapi.tport.dev/gds/diglett/search/properties?" + searchParams.toString(), {
        headers: { "Authorization": key }
    });

    console.log("Search HTTP status:", searchRes.status);
    const searchData = await searchRes.json();
    if (searchData.properties && searchData.properties.length > 0) {
        console.log("Found available properties:", searchData.properties.length);
        console.log("First available property keys:", Object.keys(searchData.properties[0]));
        console.log("First property:", JSON.stringify(searchData.properties[0], null, 2));
    } else {
        console.log("No availability returned.", searchData);
    }
}
run().catch(console.error);
