import fs from 'fs';

async function run() {
    const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfa2V5IjoiMzZiNDk4OTc0MzJmOWRhODFiZWUyMDJmNTk4NmYxMjRjZDg4ZDkwNjE3NGNkMDU1ZTAzNWI0ZTljYjk2MjkzYyIsInRpbWVzdGFtcCI6MTcxNjc3MjQ1MTUyNywic2VydmljZV9pZCI6MSwidGFyZ2V0IjoiY2hhbm5lbCIsInRhcmdldF9pZCI6MSwiaWF0IjoxNzE2NzcyNDUxLCJleHAiOjE3Nzk4NDQ0NTF9.JbsXGKNrTXF9bq5LolaRQJa1o6YjS31PxInfKKf4sfA";
    
    console.log("Fetching /properties...");
    const res = await fetch("https://dapi.tport.dev/gds/diglett/properties", {
        headers: {
            "Authorization": key
        }
    });

    const data = await res.json();
    console.log("Total properties:", data.properties?.length || data.data?.length);
    if ((data.properties || data.data) && (data.properties || data.data).length > 0) {
        const p = (data.properties || data.data)[0];
        console.log("Sample property keys:", Object.keys(p));
        console.log("Sample property content:", JSON.stringify(p, null, 2));

        const p2 = (data.properties || data.data).find((x: any) => x.name?.includes("베스트") || x.property_name?.includes("베스트"));
        if (p2) {
            console.log("Seoul Best Stay property keys:", Object.keys(p2));
            console.log("Seoul Best Stay content:", JSON.stringify(p2, null, 2));
        }
        
        // Let's also run a search
        const propertyId = p.property_id || p.id;
        console.log("Searching availability for property:", propertyId);
        
        const searchParams = new URLSearchParams();
        searchParams.append("checkin", "2024-05-01");
        searchParams.append("checkout", "2024-05-04");
        searchParams.append("adult", "2");
        searchParams.append("property_id[]", propertyId.toString());

        const searchRes = await fetch("https://dapi.tport.dev/gds/diglett/search/properties?" + searchParams.toString(), {
            headers: { "Authorization": key }
        });

        console.log("Search HTTP status:", searchRes.status);
        const searchData = await searchRes.json();
        console.log("Search response:", JSON.stringify(searchData, null, 2));
    } else {
        console.log("Response:", data);
    }
}
run().catch(console.error);
