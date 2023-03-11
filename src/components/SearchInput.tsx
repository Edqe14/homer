import { useEffect, useRef, useState } from 'react';
import { useHotkeys } from '@mantine/hooks';
import ReactModal from 'react-modal';
import { X } from '@phosphor-icons/react';
import { Table } from 'react-daisyui';
import parseSearch from '../lib/parseSearch';
import Configuration, { Macro } from '../config';

const SearchInput = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [openMacroMenu, setOpenMacroMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [macro, setMacro] = useState<Macro | null>(null);
  const query = parseSearch(search);

  useEffect(() => {
    if (macro) return;
    if (query.key) {
      const nextMacro = Configuration.get('search.macros').find(
        (m) => m.key === query.key
      );

      if (nextMacro) {
        setMacro(nextMacro);
        setSearch('');
      }
    }
  }, [search, macro, query]);

  useHotkeys([
    [
      'ctrl+K',
      (ev) => {
        ev.preventDefault();

        inputRef.current?.focus();
      },
    ],
  ]);

  return (
    <>
      <section className="w-full max-w-lg flex relative bg-base-300 rounded-xl overflow-hidden">
        {macro && (
          <section className="pl-3 -mr-1 flex items-center justify-center">
            <span
              className="cursor-help text-white rounded-md p-1 pointer-events-auto inline"
              style={{ backgroundColor: macro?.style?.background }}
              onClick={() => setOpenMacroMenu(true)}
            >
              {macro.icon ?? macro.key}
            </span>
          </section>
        )}

        <section className="relative w-full">
          <section
            ref={contentRef}
            className="absolute text-base-content inset-0 z-10 m-3 pointer-events-none overflow-x-auto overflow-y-hidden scrollbar-none"
          >
            <span className="whitespace-nowrap">{`${
              !macro && query.key ? `${query.key}: ` : ''
            }${query.text}`}</span>
          </section>

          <input
            type="text"
            autoFocus
            placeholder="Search"
            ref={inputRef}
            value={macro ? query.text : search}
            onInput={(e) => setSearch(e.currentTarget.value)}
            onScroll={(e) => {
              const perc =
                e.currentTarget.scrollLeft /
                (e.currentTarget.scrollWidth - e.currentTarget.clientWidth);

              if (contentRef.current) {
                contentRef.current.scroll({
                  left:
                    (contentRef.current.scrollWidth -
                      contentRef.current.clientWidth) *
                    perc,
                });
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !e.currentTarget.value && macro)
                setMacro(null);

              if (e.key === 'Enter') {
                const url =
                  (macro?.url ?? Configuration.get('search.url')) +
                  encodeURIComponent(query.text);

                // eslint-disable-next-line no-restricted-globals
                location.href = url;
              }
            }}
            className="caret-primary text-transparent bg-transparent transition-shadow duration-300 ease-in-out focus:drop-shadow-md outline-none p-3 w-full"
          />
        </section>
      </section>

      <ReactModal
        isOpen={openMacroMenu}
        overlayClassName="bg-neutral bg-opacity-50 grid place-items-center fixed inset-0"
        className="absolute bg-base-100 rounded-xl h-min w-full max-w-md p-4 outline-none overflow-hidden border border-base-200"
        onRequestClose={() => setOpenMacroMenu(false)}
      >
        <section className="flex justify-between items-center mb-4">
          <section className="flex gap-3 items-center">
            <section className="flex items-center justify-center">
              <span
                className="cursor-help text-white rounded-md p-1 pointer-events-auto inline"
                style={{ backgroundColor: macro?.style?.background }}
                onClick={() => setOpenMacroMenu(true)}
              >
                {macro?.icon ?? macro?.key}
              </span>
            </section>
            <h1 className="text-xl font-semibold">{macro?.name}</h1>
          </section>

          <X
            size={16}
            weight="bold"
            onClick={() => setOpenMacroMenu(false)}
            className="cursor-pointer text-primary hover:text-primary-focus transition-colors duration-300 ease-in-out"
          />
        </section>

        <Table>
          <Table.Head>
            <span>Name</span>
            <span>Value</span>
          </Table.Head>

          <Table.Body>
            <Table.Row>
              <span>Key</span>
              <code>{macro?.key}</code>
            </Table.Row>

            <Table.Row>
              <span>URL</span>
              <code className="break-all whitespace-pre-wrap">
                {macro?.url}
              </code>
            </Table.Row>
          </Table.Body>
        </Table>
      </ReactModal>
    </>
  );
};

export default SearchInput;
