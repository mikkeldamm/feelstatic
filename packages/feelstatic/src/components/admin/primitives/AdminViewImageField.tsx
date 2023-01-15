import { atom, useAtom, useSetAtom } from 'jotai';
import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';
import { RiCloseFill } from 'react-icons/ri';
import { imagesAtom, saveImageDraftAtom } from '../../../state/admin/atoms';
import { FeelstaticFieldName } from '../../../state/field';

type Props = {
  name: FeelstaticFieldName;
  value: string;
  onChange: (value: string) => void;
};

const imageSelectAtom = atom({ onSelect: null as ((imageSource: string) => void) | null });

const readFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      resolve((fileReader.result as string).replace(`data:${file.type};base64,`, ''));
    };

    fileReader.readAsDataURL(file);
  });
};

const ImageContainer = ({ value, width, height }: { value: string; width: number; height: number }) => {
  const [images] = useAtom(imagesAtom);
  const image = images.find((image) => image.src === value);

  if (image && image.isDraft && image.contents) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`data:${image.extension};base64,${image.contents}`}
        style={{ maxHeight: height }}
        className="object-contain w-auto"
        alt="image"
      />
    );
  }

  return (
    <Image
      src={value}
      width={width}
      height={height}
      style={{ maxHeight: height }}
      className="object-contain w-auto"
      alt="image"
    />
  );
};

export const ImageSelect = () => {
  const [images] = useAtom(imagesAtom);
  const [{ onSelect }, setImageSelect] = useAtom(imageSelectAtom);

  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setImageSelect({ onSelect: null });
      }
    };

    if (onSelect) {
      document.addEventListener('keyup', onKeyUp);
    }

    return () => {
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [onSelect, setImageSelect]);

  const hideImageSelect = () => {
    setImageSelect({ onSelect: null });
  };

  const onImageSelect = (src: string) => {
    onSelect?.(src);
    setImageSelect({ onSelect: null });
  };

  if (!onSelect) {
    return <></>;
  }

  return (
    <>
      <div
        onClick={hideImageSelect}
        style={{ zIndex: 5200 }}
        className="fixed inset-0 before:bg-white before:inset-0 before:absolute before:z-10 before:opacity-10 after:absolute after:inset-0 after:backdrop-blur-md"
      ></div>
      <div
        style={{ zIndex: 5300 }}
        className="fixed inset-0 mx-auto my-auto max-w-2xl max-h-[380px] bg-[#f8faf7] rounded-sm shadow-2xl flex flex-col"
      >
        <div className="flex items-center px-3 py-2 bg-white">
          <div className="pl-2 text-lg font-medium">Select an image</div>
          <div className="p-2 pr-1 ml-auto cursor-pointer" onClick={hideImageSelect}>
            <RiCloseFill className="w-7 h-7" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 px-5 py-5 overflow-y-auto">
          {images.map((image) => {
            return (
              <div
                key={image.src}
                onClick={() => onImageSelect(image.src)}
                className="flex items-center justify-center bg-white border cursor-pointer border-black/5"
              >
                <ImageContainer width={200} height={120} value={image.src} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default function AdminViewImageField({ name, value, onChange }: Props) {
  const [imageValue, setImageValue] = useState(value);
  const saveImageDraft = useSetAtom(saveImageDraftAtom);
  const setImageSelect = useSetAtom(imageSelectAtom);

  const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    const file = event.target.files[0];
    const fileContents = await readFile(file);
    const src = `/images/${file.name}`;

    setImageValue(src);
    saveImageDraft({
      name: file.name,
      path: `/public/images/${file.name}`,
      src: src,
      contents: fileContents,
      extension: file.type,
    });

    onChange(src);
  };

  const onShowImageSelect = () => {
    setImageSelect({
      onSelect: (imageSource) => {
        setImageValue(imageSource);
        onChange(imageSource);
        console.log('source set', imageSource);
      },
    });
  };

  return (
    <div className="mb-4">
      <div className="text-xs uppercase mb-1.5 font-medium">{name}</div>
      <div className="group relative border border-[#c3c7c5] bg-white px-3 py-3 flex items-center justify-center">
        <ImageContainer width={600} height={240} value={imageValue} />
        <div className="absolute inset-0 items-center justify-center hidden group-hover:flex before:bg-white before:inset-0 before:absolute before:z-10 before:opacity-75 after:absolute after:inset-0 after:backdrop-blur-md">
          <div className="z-20 text-[#09150f] flex items-center">
            <input id={`$file_${name}`} type="file" className="hidden" onChange={onFileChange} accept="image/*" />
            <div
              onClick={onShowImageSelect}
              className="flex items-center px-3 py-1 font-medium border border-[#09150f] cursor-pointer hover:bg-[#1f3329] hover:border-[#1f3329] hover:text-white"
            >
              Select an image
            </div>
            <div className="mx-2">or</div>
            <label
              htmlFor={`$file_${name}`}
              className="flex items-center px-3 py-1 font-medium border border-[#09150f] cursor-pointer hover:bg-[#1f3329] hover:border-[#1f3329] hover:text-white"
            >
              Upload an image
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
