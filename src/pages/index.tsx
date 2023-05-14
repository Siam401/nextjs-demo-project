import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Simple = () => {
  const { push } = useRouter();

  useEffect(() => {
    push('/simple');
  }, []);
  return <></>;
};

export default Simple;
