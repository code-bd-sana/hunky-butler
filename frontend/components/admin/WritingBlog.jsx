import React from 'react'
import article1 from '@/public/Dashboard/article/article1.png';
import Image from 'next/image';
import SubTitle from '../shared/typography/SubTitle';
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';
import CustomEditor from './CkEditor';

export default function WritingBlog() {

    
  return (
    <div>
        {/* titile */}

        <section className='lg:flex-row flex flex-col-reverse gap-8 justify-between'>


           <div className='flex-1'>
             <div className='flex justify-between bg-white rounded-3xl p-6'>

            <h4 className='font-medium text-3xl '>Writing blog</h4>

            <button className='bg-[#FF006A] text-white py-2 px-6 rounded-full'>
                Post
            </button>
        </div>

        {/* title */}

        <div>
            <h4 className='font-medium text-[18px] py-4 '>Title</h4>

            <div className='bg-white p-6 rounded-3xl '>

                <p>Please use JPEG format with non transparent background.</p>
            </div>
        </div>

                  <div className='mt-8'>

                      <CustomEditor/>
                  </div>
           </div>

           {/* left part */}


           <div className='lg:w-[30%]'>

            <section className='bg-white rounded-3xl'>
                <div>

                    <Image alt='image' src={article1} className='mx-auto w-[80%] py-8' />
                </div>

                <div className='px-6'>
                    <SubTitle text={'Please use JPEG format with non transparent background.'}/>
                </div>

                <div className='px-8 flex w-full pb-8 justify-between'>

                      <button className='bg-[#FF006A] text-white py-2 px-6 rounded-full'>
              Add Thumbnail
            </button>
                      <button className='bg-[#F6F4F5] text-black py-2 px-6 rounded-full'>
              Remove
            </button>


                </div>



            </section>



            <section className='bg-white rounded-3xl mt-8'>
                <div>

                     <h4 className='font-medium text-3xl p-6'>Add Tags</h4>
                </div>

                <div className='px-6'>
                    <SubTitle text={'Please use JPEG format with non transparent background.'}/>
                </div>

                <div className='px-8 flex w-full justify-between'>

                      <textarea name="" id="" className='w-full border-gray-400'></textarea>


                </div>



            </section>
            <section>
    


            </section>

           </div>
        </section>


    </div>
  )
}
