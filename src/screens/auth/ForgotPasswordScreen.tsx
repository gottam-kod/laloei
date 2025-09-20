import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

type Props = {
  route: { params?: { email?: string } };
  navigation: any;
};

const ForgotPasswordScreen: React.FC<Props> = ({ route, navigation }) => {
  const [email, setEmail] = useState(route.params?.email || '');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email) {
      Alert.alert('กรุณากรอกอีเมล');
      return;
    }
    try {
      setLoading(true);
      // ✅ call API reset password
      console.log('Request reset for', email);

      Alert.alert(
        'ส่งคำขอรีเซ็ตรหัสผ่านแล้ว',
        'กรุณาตรวจสอบอีเมลของคุณ',
        [{ text: 'ตกลง', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      Alert.alert('เกิดข้อผิดพลาด', 'ลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ลืมรหัสผ่าน</Text>
      <Text style={styles.sub}>
        กรุณากรอกอีเมลของคุณ เราจะส่งลิงก์รีเซ็ตรหัสผ่านไปให้
      </Text>

      <TextInput
        placeholder="you@company.com"
        style={styles.input}
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity
        style={[styles.btn, !email && { opacity: 0.5 }]}
        disabled={!email || loading}
        onPress={submit}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>ส่งลิงก์รีเซ็ต</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  sub: { fontSize: 14, color: '#555', marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  btn: {
    backgroundColor: '#2AA5E1',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
});
