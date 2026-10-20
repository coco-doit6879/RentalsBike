import {redirect} from 'next/navigation';
import {news} from '@/data/editorial';
export function generateStaticParams(){return news.map(article=>({slug:article.slug}));}
export default function Page(){redirect('/how-it-works');}
