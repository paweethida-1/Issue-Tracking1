import { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Input from '@/components/Input';
import Button from '@/components/Button';
import ScreenWrapper from '@/components/ScreenWrapper';
import { useNavigation } from '@react-navigation/native';
import API from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const res = await API.post('/login', { email, password });
      await AsyncStorage.setItem('token', res.data.token);
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <ScreenWrapper>
      <Text className="text-2xl font-bold mb-4">เข้าสู่ระบบ</Text>
      <Input placeholder="อีเมล" value={email} onChangeText={setEmail} />
      <Input placeholder="รหัสผ่าน" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title="เข้าสู่ระบบ" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text className="text-blue-500 mt-4">ยังไม่มีบัญชี? ลงทะเบียน</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}
