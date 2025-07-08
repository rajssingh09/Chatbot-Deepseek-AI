import React from 'react';
import Sidebar from './Sidebar';
import Prompt from './Prompt';  

const Home = () => {
  return (
    <div className='flex h-screen w-screen overflow-hidden bg-[#1e1e1e] text-white m-0 p-0'>
      {/* Sidebar */}
      <div className='w-64 h-screen bg-[#232327]'>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        <div className='flex-1 flex items-center justify-center px-6'>
          <Prompt />
        </div>
      </div>
    </div>
  );
};

export default Home;
