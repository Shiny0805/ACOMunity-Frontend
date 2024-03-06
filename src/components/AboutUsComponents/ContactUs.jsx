import React, { useState } from "react";
  
  export default function Contactus() {

    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState('');
    const [ message, setMessage ] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    return (
    <div class='w-3/4 m-auto rounded-2xl border p-3'>
        <div class='text-4xl text-center p-10'>
            Contact Us
        </div>
        
        <div>
            <form>
                <div class='flex justify-between items-center mb-10'>
                    <div class='w-1/2 p-1 text-2xl'>
                        <label>First Name</label>
                        <input type='text' id='first_name' class='w-full rounded-lg p-1 text-black' placeholder="First Name" />
                    </div>

                    <div class='w-1/2 p-1 text-2xl'>
                        <label>Last Name</label>
                        <input type='text' id='last_name' class='w-full rounded-lg p-1 text-black' placeholder="Last Name" />
                    </div>
                </div>

                <div class='flex justify-between items-center mb-10'>
                    <div class='w-1/2 p-1 text-2xl'>
                        <label>Email</label>
                        <input type='email' id='email' class='w-full rounded-lg p-1 text-black' placeholder="Your email" />
                    </div>

                    <div class='w-1/2 p-1 text-2xl'>
                        <label>Phone Number</label>
                        <input type='number' id='phone_number' class='w-full rounded-lg p-1 text-black' placeholder="+1 (239) 494 5915" />
                    </div>
                </div>

                <div class='mb-10'>
                    <div class='p-1 text-2xl'>
                        <label>Cover Letter</label>
                        <input type='text' id='cover_letter' class='w-full rounded-lg p-1 text-black h-[100px]' placeholder="" />
                    </div>
                </div>

                <div class='mb-10 flex justify-center'>
                    <div class='bg-lime-500	 hover:bg-lime-600 px-10 py-2 rounded-lg cursor-pointer'>
                        <button type='button'>Submit</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    );
  }
  