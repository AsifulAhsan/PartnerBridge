'use client'

import React from 'react'
import { ConfigProvider, Spin, message, notification } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

interface Props {
  children: React.ReactNode
}

// Default global configurations
Spin.setDefaultIndicator(<LoadingOutlined spin />)
message.config({ maxCount: 1 })
notification.config({ maxCount: 1 })

export const AppColorPalette = {
  // Brand
  brandPrimary: '#3A73A6', // Darker, yet still muted professional blue
  brandSecondary: '#23496B', // Strong, dark variant for excellent contrast

  // Backgrounds
  bgBase: '#FFFFFF',
  bgSurface: '#F8F9FA',
  bgMuted: '#EFF2F6',
  bgAccent: '#DEE2E6',

  // Text
  textPrimary: '#212529',
  textSecondary: '#6C757D',
  textInverse: '#FFFFFF',

  // Borders / Dividers
  borderLight: '#DDE4EB',
  borderStrong: '#B8C0C7',

  // States
  hoverBg: '#F0F3F6',
  activeBg: '#DEE2E6',

  // Semantic / Utility
  info: '#3A73A6', // Aligned with the new brandPrimary
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
}

export const AppTheme = {
  components: {
    Table: {
      headerFilterHoverBg: AppColorPalette.brandSecondary,
      headerSortHoverBg: AppColorPalette.brandSecondary,
      headerSortActiveBg: AppColorPalette.brandSecondary,
      headerBg: AppColorPalette.brandPrimary,
      headerColor: AppColorPalette.textInverse,
      rowHoverBg: AppColorPalette.bgSurface,
      rowSelectedBg: AppColorPalette.bgSurface,
      rowSelectedHoverBg: AppColorPalette.bgSurface,
      colorIcon: AppColorPalette.textInverse,
      colorIconHover: AppColorPalette.textInverse,
      colorBorderSecondary: AppColorPalette.borderLight,
    },
  },
}

export const AppThemeProvider = (props: Props) => {
  return (
    <ConfigProvider
      pagination={{ showSizeChanger: true }}
      componentSize="small"
      theme={AppTheme}
    >
      {props.children}
    </ConfigProvider>
  )
}
