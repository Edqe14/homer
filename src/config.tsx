import type { ReactNode } from 'react';
import { StackOverflowLogo, YoutubeLogo } from '@phosphor-icons/react';
import GetSet from './lib/getSet';

export interface Macro {
  key: string;
  name: string;
  icon?: ReactNode;
  url: string;
  style?: {
    background?: string;
    text?: string;
  };
}

const Configuration = new GetSet({
  search: {
    url: 'https://duckduckgo.com/?q=',
    macros: [
      {
        key: 'so',
        name: 'Stack Overflow',
        icon: <StackOverflowLogo size={20} weight="bold" />,
        url: 'https://stackoverflow.com/search?q=',
        style: {
          background: '#f7912c',
        },
      },
      {
        key: 'yt',
        name: 'Youtube',
        icon: <YoutubeLogo size={20} weight="fill" />,
        url: 'https://www.youtube.com/results?search_query=',
        style: {
          background: '#f43633',
        },
      },
    ] satisfies Macro[],
  },
} as const);

export default Configuration;
