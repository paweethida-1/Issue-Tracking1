import { TextInput } from 'react-native';

export default function Input({ ...props }) {
  return (
    <TextInput
      className="border p-3 rounded mb-3 text-base"
      placeholderTextColor="#aaa"
      {...props}
    />
  );
}
