
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.name} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-themison-gray mx-2 flex-shrink-0" />
            )}
            
            {item.href && index !== items.length - 1 ? (
              <Link 
                to={item.href} 
                className="text-themison-gray hover:text-primary text-sm"
              >
                {item.name}
              </Link>
            ) : (
              <span className={`text-sm ${index === items.length - 1 ? 'font-medium text-themison-text' : 'text-themison-gray'}`}>
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
