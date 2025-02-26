import React from 'react';
import { ClipLoader } from 'react-spinners';

/**
 * @description LoaderProps interface
 * @interface
 * @property {boolean} loading - The loading boolean
 */
interface LoaderProps {
  loading: boolean;
}

/**
 * @description Loader component
 * @param loading - The loading boolean
 * @returns - Loader component
 */
const loaderStyle: React.CSSProperties = {
  display: 'flex'
};

/**
 * @description Loader component
 * @param loading - The loading boolean 
 * @returns - Loader component
 */
const CustomLoader: React.FC<LoaderProps> = ({ loading }) => {
  return (
    <div style={loaderStyle}>
      <ClipLoader size={10} color={'#09a7f0'} loading={loading} />
    </div>
  );
};

export default CustomLoader;
