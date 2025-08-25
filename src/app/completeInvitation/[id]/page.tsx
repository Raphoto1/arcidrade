import CompleteInvitation from '@/components/auth/CompleteInvitation';

export default function Register({ params }: any) {
  const { id } = params;
  return (
    <div className='flex justify-center items-center'>
      <CompleteInvitation id={id} />
    </div>
  );
}
