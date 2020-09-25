import { useField } from "formik";

export default function GenericSelect(props) {
  const [field, meta, helpers] = useField(props.name);
  return (
    <div>
      <label className="block" htmlFor={props.name}>
        {props.label}
      </label>
      <select {...field} {...props}>
        <option>Select A Genre</option>
        {props.options.map((item) => (
          <option key={item._id} value={item._id}>
            {item.name}
          </option>
        ))}
      </select>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
}
