import AdminLayout from '../components/admin/AdminLayout';
import AdminComponents from '../components/admin/views/AdminComponents';
import AdminMedia from '../components/admin/views/AdminMedia';
import AdminPages from '../components/admin/views/AdminPages';
import AdminPublish from '../components/admin/views/AdminPublish';

type FeelstaticPageProps = {
  params: { fst: string[] };
};

export const FeelstaticPage = async ({ params: { fst } }: FeelstaticPageProps) => {
  const view = fst ? fst[0] : 'pages';
  const isEdit = fst ? fst[1] === 'edit' : false;
  const itemUrl = fst && isEdit ? `/${fst.slice(2).join('/')}` : null;

  return (
    <AdminLayout>
      {view === 'pages' && <AdminPages pageUrl={itemUrl} />}
      {view === 'components' && <AdminComponents componentUrl={itemUrl} />}
      {view === 'media' && <AdminMedia />}
      {view === 'publish' && <AdminPublish />}
    </AdminLayout>
  );
};

export const FeelstaticHead = () => {
  return (
    <>
      <title>Feelstatic - Your static CMS</title>
      <meta charSet="utf-8" />
      <meta name="robots" content="noindex,nofollow" />
    </>
  );
};
