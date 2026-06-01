importScripts('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');

self.onmessage = async function(e) {
  const { skillKey, files, baseUrl } = e.data;
  const zip = new JSZip();
  const folder = zip.folder(skillKey);
  
  try {
    let loaded = 0;
    const total = files.length;
    
    const fetchPromises = files.map(async (fileName) => {
      const fileUrl = baseUrl + skillKey + '/' + fileName;
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error('Failed to fetch ' + fileName);
      const blob = await response.blob();
      folder.file(fileName, blob);
      loaded++;
      self.postMessage({ type: 'progress', percent: (loaded / total) * 50 });
    });
    
    await Promise.all(fetchPromises);
    
    const content = await zip.generateAsync({ 
      type: 'blob',
      compression: "DEFLATE",
      compressionOptions: { level: 6 }
    }, function updateCallback(metadata) {
        self.postMessage({ type: 'progress', percent: 50 + (metadata.percent * 0.5) });
    });
    
    self.postMessage({ type: 'done', content });
  } catch(err) {
    self.postMessage({ type: 'error', error: err.message });
  }
};
