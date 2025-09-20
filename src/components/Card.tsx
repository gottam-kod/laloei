import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Card({ title, children, footer, ...props }: CardProps) {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardWrapper} {...props}>
        {/* Header */}
        {title && (
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{title}</Text>
          </View>
        )}

        {/* Body */}
        <View style={styles.cardBody}>
          {children}
        </View>

        {/* Footer (Optional) */}
        {footer && <View style={styles.cardFooter}>{footer}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    margin: 5,

    borderColor: '#ccc'
  },
  cardWrapper: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    // overflow: 'hidden',
    borderWidth: 0,
    borderColor: 'rgba(229,127,55,0.15)'
  },
  cardHeader: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
   borderBottomColor: 'rgba(229,127,55,0.15)'
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardBody: {
    padding: 15,
  },
  cardFooter: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});
