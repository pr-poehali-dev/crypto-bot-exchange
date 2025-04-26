import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useGameStore } from '@/lib/store';
import { getTelegramUser, requestWithdrawal } from '@/lib/telegram';
import { AlertCircle, ArrowRightIcon } from 'lucide-react';

interface WithdrawFormProps {
  minAmount?: number;
  conversionRate?: number; // Курс конвертации монет в рубли
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ 
  minAmount = 1000, 
  conversionRate = 0.1 // 1 монета = 0.1 рубля
}) => {
  const [amount, setAmount] = useState<number>(minAmount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { coins, withdrawCoins } = useGameStore();
  const { toast } = useToast();
  
  const maxWithdrawCoins = Math.floor(coins);
  const maxWithdrawAmount = Math.floor(maxWithdrawCoins * conversionRate);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверка минимальной суммы
    if (amount < minAmount) {
      toast({
        title: "Ошибка вывода",
        description: `Минимальная сумма для вывода: ${minAmount} монет`,
        variant: "destructive"
      });
      return;
    }
    
    // Проверка наличия достаточного количества монет
    const requiredCoins = Math.ceil(amount / conversionRate);
    if (requiredCoins > coins) {
      toast({
        title: "Недостаточно монет",
        description: `Для вывода ${amount} ₽ требуется ${requiredCoins} монет`,
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Получаем данные пользователя Telegram
    const user = getTelegramUser();
    if (!user) {
      toast({
        title: "Ошибка вывода",
        description: "Необходимо подключить Telegram для вывода средств",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Отправка запроса на вывод средств
      const success = await requestWithdrawal(user.id, amount);
      
      if (success) {
        // Списываем монеты у пользователя
        withdrawCoins(requiredCoins);
        
        toast({
          title: "Запрос на вывод отправлен",
          description: `Ваша заявка на вывод ${amount} ₽ принята. Мы свяжемся с вами в ближайшее время.`,
        });
      } else {
        throw new Error("Не удалось отправить запрос на вывод");
      }
    } catch (error) {
      toast({
        title: "Ошибка вывода",
        description: "Произошла ошибка при отправке запроса. Попробуйте позже.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const updateAmount = (value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0) {
      setAmount(0);
    } else {
      setAmount(Math.min(numValue, maxWithdrawAmount));
    }
  };
  
  // Расчет необходимого количества монет для указанной суммы
  const requiredCoins = Math.ceil(amount / conversionRate);
  
  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit}>
        <h3 className="text-lg font-medium mb-4">Вывод средств</h3>
        
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Условия вывода:</p>
              <ul className="list-disc list-inside text-muted-foreground mt-1 ml-1">
                <li>Минимальная сумма: {minAmount} монет</li>
                <li>Курс конвертации: 1 монета = {conversionRate} ₽</li>
                <li>Вывод через администратора бота</li>
              </ul>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Сумма вывода (₽)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => updateAmount(e.target.value)}
              min={minAmount}
              max={maxWithdrawAmount}
              disabled={isSubmitting}
              className="text-right pr-10"
            />
            <div className="text-sm text-right text-muted-foreground">
              Требуется: {requiredCoins} монет
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || amount < minAmount || requiredCoins > coins}
          >
            {isSubmitting ? "Обработка..." : "Запросить вывод"}
            {!isSubmitting && <ArrowRightIcon className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default WithdrawForm;
