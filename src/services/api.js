export async function fetchPomofocusData(authorization, cookie, onProgress) {
  let pageNum = 0;
  let allData = [];
  let hasMore = true;
  const BATCH_SIZE = 10;

  const fetchPage = async (page) => {
    const targetUrl = `https://pomofocus.io/api/daily-report-items?pageNum=${page}`;
    // Use cors-anywhere for production to bypass CORS
    const url = import.meta.env.DEV 
      ? `/api/daily-report-items?pageNum=${page}` 
      : `https://cors-anywhere.herokuapp.com/${targetUrl}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json, text/plain, */*',
        'authorization': authorization,
        'cookie': cookie,
        'x-client-version': '1.0.1',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    return response.json();
  };

  while (hasMore) {
    try {
      if (onProgress) {
        onProgress(pageNum);
      }

      const promises = [];
      for (let i = 0; i < BATCH_SIZE; i++) {
        promises.push(fetchPage(pageNum + i));
      }

      const results = await Promise.all(promises);
      
      let emptyFound = false;
      for (const data of results) {
        if (data && data.dailyReportItems && data.dailyReportItems.length > 0) {
          allData = allData.concat(data.dailyReportItems);
        } else {
          emptyFound = true;
          break; // Stop adding data once an empty page is found
        }
      }

      if (emptyFound) {
        hasMore = false;
      } else {
        pageNum += BATCH_SIZE;
        // Small delay to prevent rate limiting even with batches
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error('Failed to fetch Pomofocus data:', error);
      throw error;
    }
  }

  // Ensure sorting by date since batching might slightly mix ordering
  allData.sort((a, b) => new Date(b.created) - new Date(a.created));

  return allData;
}
