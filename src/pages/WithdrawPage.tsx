import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import WithdrawForm from '@/components/WithdrawForm';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/lib/store';
import { getTelegramUser, initTelegramWebApp } from '@/lib/telegram';
import { ArrowLeft } from 'lucide-react';
import Navigation from '@/components/Navigation';

const WithdrawPage: React.FC = () => {
  const navigate = useNavigate();
  const { coins } = useGameStore();
  
  useEffect(() => {
    // Инициализация Telegram WebApp
    initTelegramWebApp();
  }, []);
  
  // Получаем данные пользователя
  const user = getTelegramUser();
  const isConnected = !!user;
  
  return (
    <div className="container max-w-md mx-auto px-4 pb-20 pt-4">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Вывод монет</h1>
      </div>
      
      <div className="mb-6 rounded-lg bg-primary/10 p-4">
        <div className="text-sm text-muted-foreground mb-1">Доступно для вывода</div>
        <div className="text-3xl font-bold">{coins.toFixed(0)} монет</div>
      </div>
      
      {isConnected ? (
        <WithdrawForm minAmount={1000} conversionRate={0.1} />
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <p className="text-yellow-700 mb-2">
            Для вывода средств необходимо подключить аккаунт Telegram
          </p>
          <Button
            onClick={() => navigate('/profile')}
            variant="outline"
            className="bg-white border-yellow-200 text-yellow-700"
          >
            Подключить Telegram
          </Button>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Важная информация</h3>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>Заявки на вывод обрабатываются в течение 24 часов</li>
          <li>Минимальная сумма вывода — 100 рублей (1000 монет)</li>
          <li>Сообщение о выводе будет отправлено в Telegram</li>
          <li>Администратор свяжется с вами для уточнения деталей</li>
        </ul>
      </div>
      
      <Navigation />
    </div>
  );
};

export default WithdrawPage;
