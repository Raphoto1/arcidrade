import CompleteInvitation from '@/components/auth/CompleteInvitation';
import ResetPassword from '@/components/auth/ResetPassword';

export default function Register({ params }: any) {
  const { id } = params;
  return (
    <div className='flex justify-center items-center'>
      <ResetPassword id={id} />
    </div>
  );
}
