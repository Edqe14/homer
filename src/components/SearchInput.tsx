/* eslint-disable @typescript-eslint/indent */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useHotkeys } from '@mantine/hooks';
import ReactModal from 'react-modal';
import { X } from '@phosphor-icons/react';
import { Table } from 'react-daisyui';
import autoAnimate from '@formkit/auto-animate';
import parseSearch from '../lib/parseSearch';
import Configuration, { Macro } from '../config';
import goTo from '../lib/goTo';

const SearchInput = () => {
  const keysRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [inputFocused, setInputFocused] = useState(true);
  const [openMacroMenu, setOpenMacroMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [macro, setMacro] = useState<Macro | null>(null);
  const query = parseSearch(search);
  const searchMacros = useMemo(() => {
    if (macro) {
      return macro.autoComplete
        ? macro.autoComplete({
            query: query.text,
            setSearch,
          })
        : [];
    }
    return Configuration.get('search.macros').filter(
      (m) =>
        query.text === '/' ||
        m.key === query.text ||
        m.name.toLowerCase().includes(query.text.toLowerCase())
    );
  }, [query.text]);

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

  useEffect(() => {
    if (menuRef.current) autoAnimate(menuRef.current);
  }, [menuRef.current]);

  useEffect(() => {
    if (keysRef.current) autoAnimate(keysRef.current);
  }, [keysRef.current]);

  useEffect(() => {
    const onFocus = () => setInputFocused(true);
    const onBlur = () => setInputFocused(false);

    inputRef.current?.addEventListener('focus', onFocus);
    inputRef.current?.addEventListener('blur', onBlur);

    return () => {
      inputRef.current?.removeEventListener('focus', onFocus);
      inputRef.current?.removeEventListener('blur', onBlur);
    };
  }, [inputRef.current]);

  const menuUpdate = (v: Macro) => {
    inputRef.current?.focus();

    if (!macro) {
      setMacro(v);
      setSearch('');

      return;
    }

    v.action({
      query: query.text,
      setSearch,
      setMacro,
    });
  };

  return (
    <>
      <section className="w-full max-w-lg flex relative bg-base-300 rounded-xl overflow-hidden">
        {macro && (
          <section className="pl-3 -mr-1 flex items-center justify-center">
            <span
              className="cursor-help bg-neutral text-white rounded-md p-1 pointer-events-auto inline"
              style={{
                backgroundColor: macro?.style?.background,
                color: macro?.style?.text,
              }}
              onClick={() => setOpenMacroMenu(true)}
            >
              {macro.icon ?? macro.key}
            </span>
          </section>
        )}

        <section className="relative w-full">
          <section
            ref={keysRef}
            className={[
              'absolute right-0 top-0 bottom-0 grid place-items-center pointer-events-none transition-opacity duration-150 ease-in-out',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {!inputFocused && (
              <span className="tracking-tighter absolute right-3 text-xs font-jetbrains opacity-75 bg-base-100 py-1 px-2 rounded-md border border-secondary whitespace-nowrap">
                ctrl + K
              </span>
            )}

            {inputFocused && !search && !macro && (
              <span className="absolute right-3 text-xs font-jetbrains opacity-75 bg-base-100 py-1 px-2 rounded-md border border-secondary">
                /
              </span>
            )}
          </section>

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
            tabIndex={-1}
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
                if (macro) {
                  return macro.action({
                    query: query.text,
                    setSearch,
                    setMacro,
                  });
                }

                goTo(Configuration.get('search.url'), {
                  q: query.text,
                });
              }
            }}
            className="caret-primary text-transparent bg-transparent transition-shadow duration-300 ease-in-out focus:drop-shadow-md outline-none p-3 w-full"
          />
        </section>
      </section>

      {/* Menu */}
      {query.text && (
        <section
          ref={menuRef}
          role="menu"
          className="absolute w-full max-w-lg top-[9.5rem] bg-base-300 rounded-xl last:rounded-b-xl"
        >
          {searchMacros &&
            searchMacros.map((v, i) => (
              <section
                key={v.key}
                className={[
                  'p-3 hover:bg-neutral-content hover:bg-opacity-10 transition-colors ease-in-out duration-200 cursor-pointer flex gap-3 items-center outline-none border-2 border-transparent focus:border-2 focus:border-primary',
                  i % 2 !== 0 && 'bg-base-200',
                  i === 0 && 'rounded-t-xl',
                  i === searchMacros.length - 1 && 'rounded-b-xl',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => menuUpdate(v)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    menuUpdate(v);
                  }
                }}
              >
                <span
                  className="text-white bg-accent rounded-md p-1 pointer-events-auto inline"
                  style={{
                    backgroundColor: v?.style?.background,
                    color: v?.style?.text,
                  }}
                >
                  {v.icon ?? v.key}
                </span>

                <span className="font-medium">{v.name}</span>
              </section>
            ))}
        </section>
      )}

      <ReactModal
        isOpen={openMacroMenu}
        overlayClassName={[
          'bg-neutral-content bg-opacity-5 grid place-items-center fixed inset-0 transition-opacity duration-200 ease-in-out',
          openMacroMenu ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        className={[
          'absolute bg-base-100 rounded-xl h-min w-full max-w-md p-4 outline-none overflow-hidden border border-base-200 transition-opacity duration-200 ease-in-out',
          openMacroMenu ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        onRequestClose={() => setOpenMacroMenu(false)}
        closeTimeoutMS={300}
      >
        <section className="flex justify-between items-center mb-4">
          <section className="flex gap-3 items-center">
            <section className="flex items-center justify-center">
              <span
                className="cursor-help bg-neutral text-white rounded-md p-1 pointer-events-auto inline"
                style={{
                  backgroundColor: macro?.style?.background,
                  color: macro?.style?.text,
                }}
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

        <Table className="w-full">
          <Table.Head>
            <span>Name</span>
            <span>Value</span>
          </Table.Head>

          <Table.Body>
            <Table.Row>
              <span>Key</span>
              <code>{macro?.key}</code>
            </Table.Row>
          </Table.Body>
        </Table>
      </ReactModal>
    </>
  );
};

export default SearchInput;
