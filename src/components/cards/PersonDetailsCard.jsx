import Image from "next/image";

const PersonDetailsCard = ({ customer }) => {
  const { phone, email, location, fullname, photo } = customer;

  return (
    <div className="rounded-lg border border-default-200 p-6">
      <Image
        src={photo}
        width={96}
        height={96}
        className="w-24 rounded-full border border-gray-200 bg-gray-100 p-1 dark:border-gray-600 dark:bg-gray-700"
        alt="avatar"
      />
      <h4 className="mb-1 mt-3 text-lg">{fullname}</h4>
      <div className="mt-6 text-start">
        {/* <h4 className="mb-2.5 text-sm uppercase">About Me :</h4>
        <p className="mb-6 text-gray-400">
          Hi I&apos;m Kaiya Botosh,has been the industry&apos;s standard dummy
          text ever since the 1500s, when an unknown printer took a galley of
          type.
        </p> */}
        <p className="mb-3 text-zinc-400">
          <b>Full Name :</b> <span className="ms-2">{fullname}</span>
        </p>
        <p className="mb-3 text-zinc-400">
          <b>Mobile :</b>
          <span className="ms-2">{phone}</span>
        </p>
        <p className="mb-3 text-zinc-400">
          <b>Email :</b> <span className="ms-2 ">{email}</span>
        </p>
        {/* <p className="mb-1.5 text-zinc-400">
          <b>Location :</b> <span className="ms-2">{location}</span>
        </p> */}
      </div>
    </div>
  );
};

export default PersonDetailsCard;
