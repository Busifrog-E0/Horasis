export function blobToUint8Array(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    // Read the Blob as an ArrayBuffer
    reader.readAsArrayBuffer(blob);
    
    // When the file has been read, convert the ArrayBuffer to a Uint8Array
    reader.onloadend = function() {
      if (reader.error) {
        reject(reader.error);
      } else {
        const arrayBuffer = reader.result;
        const uint8Array = new Uint8Array(arrayBuffer);
        resolve(uint8Array);
      }
    };
    
    reader.onerror = function(error) {
      reject(error);
    };
  });
}