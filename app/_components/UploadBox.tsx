import React from "react";
import { Upload } from "lucide-react";

export function UploadBox({ onChange }: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label className="border-[3px] border-dashed border-[#dfe4ee] hover:border-[#3b5bdb] rounded-[16px] p-[36px_20px] flex flex-col items-center justify-center text-center bg-zinc-50/50 hover:bg-zinc-50 transition cursor-pointer relative">
      <input
        type="file"
        multiple
        accept="image/*"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={onChange}
      />
      <div className="text-[#3b5bdb] mb-3">
        <Upload className="w-[56px] h-[56px] stroke-[2]" />
      </div>
      <p className="font-bold text-zinc-900 text-base mb-1">
        Click to choose photos
      </p>
      <p className="text-sm text-zinc-500">
        You can pick many photos at once
      </p>
    </label>
  );
}