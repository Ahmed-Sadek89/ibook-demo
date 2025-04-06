import Link from "next/link";
import cls from "./home.module.scss";

const ServicesList = ({ services }) => {
  return (
    <div className={cls.services}>
      {services.map((service) => (
        <Link
          href={service.android}
          key={`${service.id}-${service.name_ar}`}
          style={{ textDecoration: "none" }}
          className={cls.service}
        >
          <h5>{service.name_ar}</h5>
        </Link>
      ))}
    </div>
  );
};

export default ServicesList;
