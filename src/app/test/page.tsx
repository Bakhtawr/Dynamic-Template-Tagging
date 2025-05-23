import RichTextEditorSec from "../components/test/EditorSec";


export default function Test() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 font-[family-name:var(--font-geist-sans)]">    
        <h1 className="text-2xl font-bold">Dynamic Template Tagging</h1>
        
       <RichTextEditorSec />
    </div>
  );
}