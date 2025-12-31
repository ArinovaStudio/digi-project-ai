import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.join(process.cwd(), 'storage', 'csv_files');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function saveFile(buffer: Buffer | string, prefix: string = 'scrape'): Promise<string> {
  const filename = `${prefix}_${uuidv4()}.csv`;
  const filepath = path.join(UPLOAD_DIR, filename);

  try {
    await fs.promises.writeFile(filepath, buffer);
    return filepath;
  } catch (error) {
    console.error('File Save Error:', error);
    throw new Error('Failed to save file');
  }
}

export async function deleteFile(filepath: string | null): Promise<void> {
  if (!filepath) return;

  try {
    if (!filepath.startsWith(UPLOAD_DIR)) {
      console.warn(`Attempted to delete file outside storage: ${filepath}`);
      return;
    }

    try {
        await fs.promises.access(filepath);
    } catch {
        return;
    }

    await fs.promises.unlink(filepath);
  } catch (error) {
    console.error('File Delete Error:', error);
  }
}