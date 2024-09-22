import React from 'react';
import { useSelector } from 'react-redux';
import { Blocks } from 'react-loader-spinner';

const Loader = () => {
  const isLoading = useSelector((state) => state.loader.isLoading);

  if (!isLoading) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 9999,
    }}>
      <Blocks
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={['#39C7AD', '#39C7AD', '#39C7AD', '#39C7AD', '#39C7AD']}
      />
    </div>
  );
};

export default Loader;