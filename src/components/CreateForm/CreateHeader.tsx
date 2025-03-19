type TabItemProps = {
    name: string;
    isActive: boolean;
    onClick: () => void;
  };
  
  export default function TabItem({ name, isActive, onClick }: TabItemProps) {
    return (
      <li className="me-2">
        <a
          href="#"
          onClick={onClick}
          className={`inline-block p-4 border-b-2 rounded-t-lg ${
            isActive
              ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
              : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
          }`}
        >
          {name}
        </a>
      </li>
    );
  }
  