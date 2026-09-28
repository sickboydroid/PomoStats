export async function fetchPomofocusData(authorization, cookie, onProgress) {
  let pageNum = 0;
  let allData = [];
  let hasMore = true;

  while (hasMore) {
    try {
      if (onProgress) {
        onProgress(pageNum);
      }

      const response = await fetch(`https://pomofocus.io/api/daily-report-items?pageNum=${pageNum}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json, text/plain, */*',
          'authorization': authorization,
          'cookie': cookie,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && data.dailyReportItems && data.dailyReportItems.length > 0) {
        allData = allData.concat(data.dailyReportItems);
        pageNum++;
      } else {
        hasMore = false;
      }
      
      // Add a small delay to avoid hitting rate limits
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to fetch Pomofocus data:', error);
      throw error;
    }
  }

  return allData;
}
