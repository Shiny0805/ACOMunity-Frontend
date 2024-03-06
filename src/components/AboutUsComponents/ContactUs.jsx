import React, { useState } from "react";
  
  export default function Contactus() {

    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState('');
    const [ message, setMessage ] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
    }

    return (
    <div class='container m-auto'>
        <div class='text-4xl text-center p-10'>
            Contact Us
        </div>
        
        <div class='w-3/4 m-auto'>
            <form>
                <div class='flex justify-between items-center'>
                    <div class='w-1/2'>
                        <label>First Name</label>
                        <input class='w-full' placeholder="First Name" />
                    </div>

                    <div class='w-1/2'>
                        <label>Last Name</label>
                        <input class='w-full' placeholder="Last Name" />
                    </div>
                </div>
                

            </form>
        </div>
    </div>
    );
  }
  