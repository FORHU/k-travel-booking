import fs from 'fs';

async function run() {
    const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfa2V5IjoiMzZiNDk4OTc0MzJmOWRhODFiZWUyMDJmNTk4NmYxMjRjZDg4ZDkwNjE3NGNkMDU1ZTAzNWI0ZTljYjk2MjkzYyIsInRpbWVzdGFtcCI6MTcxNjc3MjQ1MTUyNywic2VydmljZV9pZCI6MSwidGFyZ2V0IjoiY2hhbm5lbCIsInRhcmdldF9pZCI6MSwiaWF0IjoxNzE2NzcyNDUxLCJleHAiOjE3Nzk4NDQ0NTF9.JbsXGKNrTXF9bq5LolaRQJa1o6YjS31PxInfKKf4sfA";
    
    // 1. Fetch properties and find one that is enabled
    console.log("Fetching /properties...");
    const res = await fetch("https://dapi.tport.dev/gds/diglett/properties", {
        headers: { "Authorization": key }
    });

    const data = await res.json();
    const props = data.properties || data.data;
    const enabledProp = props.find((p: any) => p.status === "enabled" || p.status === "active");
    
    if (!enabledProp) {
         console.log("No enabled property found.");
         return;
    }
    console.log("Found enabled property:", enabledProp.id, enabledProp.name);

    // 2. Try fetching static content from /properties/{id}
    const propId = enabledProp.id || enabledProp.property_id;
    console.log(`Fetching /properties/${propId}...`);
    const contentRes = await fetch(`https://dapi.tport.dev/gds/diglett/properties/${propId}`, {
         headers: { "Authorization": key }
    });
    console.log("Content HTTP status:", contentRes.status);
    const contentData = await contentRes.json();
    console.log("Content Response Keys:", Object.keys(contentData));
    if (contentData.images || contentData.thumbnail) {
         console.log("Found images in /properties/:id !");
    } else {
         console.log("No images in /properties/:id", JSON.stringify(contentData, null, 2).slice(0, 500));
    }

    // 3. Search availability for the enabled property
    const searchParams = new URLSearchParams();
    searchParams.append("checkin", "2026-05-01");
    searchParams.append("checkout", "2026-05-04");
    searchParams.append("adult", "2");
    searchParams.append("property_id[]", propId);

    const searchRes = await fetch("https://dapi.tport.dev/gds/diglett/search/properties?" + searchParams.toString(), {
        headers: { "Authorization": key }
    });

    console.log("Search HTTP status:", searchRes.status);
    const searchData = await searchRes.json();
    console.log("Search response for enabled property:", JSON.stringify(searchData, null, 2));

}
run().catch(console.error);
