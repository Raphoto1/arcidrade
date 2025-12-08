import CompleteInvitation from '@/components/auth/CompleteInvitation';

export default async function Register({ params }: any) {
  const { id } = await params;
  return (
    <div className='flex justify-center items-center'>
      <CompleteInvitation id={id} />
    </div>
  );
}
