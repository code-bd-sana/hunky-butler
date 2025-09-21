import React from 'react';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

export default function QuillEditor() {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],        
      ['bold', 'italic', 'underline', 'strike'], 
      [{ list: 'ordered' }, { list: 'bullet' }], 
      ['blockquote', 'code-block'],           
      [{ align: [] }],                         
      [{ color: [] }, { background: [] }],      
      ['link'],                                  
      ['clean'],                                 
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'blockquote', 'code-block',
    'align',
    'color', 'background',
    'link',  
  ];

  const { quill, quillRef } = useQuill({ modules, formats });

  return (
 <div>
       <h4 className='font-medium text-lg text-[#333333] py-2'>body</h4>
       <div className="border-none">



 
      <div
        ref={quillRef}
        className="bg-white rounded-3xl border-none-special min-h-[400px] p-2"
      />
    </div>
 </div>
  );
}
