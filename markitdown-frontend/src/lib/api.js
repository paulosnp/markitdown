const BASE_URL = '/api';

export async function convertFile(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error('Resposta inválida da API'));
        }
      } else {
        reject(new Error(`Erro ${xhr.status}: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Falha na conexão com a API')));
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelado')));

    xhr.open('POST', `${BASE_URL}/convert`);
    xhr.send(formData);
  });
}

export async function convertUrl(url) {
  const response = await fetch(`${BASE_URL}/convert/url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function convertText(content, format = 'html') {
  const response = await fetch(`${BASE_URL}/convert/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, format }),
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function checkHealth() {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
