import { Text, TouchableOpacity } from 'react-native';

export default function Button({ title, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} className="bg-blue-500 py-3 rounded items-center">
      <Text className="text-white font-bold">{title}</Text>
    </TouchableOpacity>
  );
}
