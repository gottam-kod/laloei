// screens/profile/ChangePasswordScreen.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { resetPassword } from '../../connections/auth/authApi';

export default function ChangePasswordScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = next.length >= 8 && next.length <= 128 && next === confirm;

  const submit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await resetPassword(
        current,
        next,
        confirm 
      );
      Alert.alert(t('password.changedTitle', 'สำเร็จ'), t('password.changedBody', 'เปลี่ยนรหัสผ่านเรียบร้อย'));
      navigation.goBack();
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ';
      Alert.alert('Error', Array.isArray(msg) ? msg.join('\n') : String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>{t('profile.changePassword', 'เปลี่ยนรหัสผ่าน')}</Text>

      <TextInput
        placeholder={t('password.current', 'รหัสผ่านเดิม (ถ้าเคยตั้ง)')}
        secureTextEntry
        value={current}
        onChangeText={setCurrent}
        style={{ backgroundColor:'#fff', borderRadius:12, padding:12 }}
      />
      <TextInput
        placeholder={t('password.new', 'รหัสผ่านใหม่ (8–128 ตัว)')}
        secureTextEntry
        value={next}
        onChangeText={setNext}
        style={{ backgroundColor:'#fff', borderRadius:12, padding:12 }}
      />
      <TextInput
        placeholder={t('password.confirm', 'ยืนยันรหัสผ่านใหม่')}
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
        style={{ backgroundColor:'#fff', borderRadius:12, padding:12 }}
      />
      <Pressable
        disabled={!canSubmit || loading}
        onPress={submit}
        style={{ backgroundColor: canSubmit && !loading ? '#0EA5E9' : '#93c5fd', padding:14, borderRadius:12, alignItems:'center' }}
      >
        <Text style={{ color:'#fff', fontWeight:'700' }}>{t('common.save', 'บันทึก')}</Text>
      </Pressable>
    </View>
  );
}
