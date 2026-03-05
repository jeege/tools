import { useEffect, useState } from 'react';
import { tunnelApi, type IngressRule } from '@/api/tunnel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toastEmitter } from '@/api/client';
import { Globe, Plus, Trash2, Server, ExternalLink, X } from 'lucide-react';

export function TunnelPage() {
  const [rules, setRules] = useState<IngressRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newRule, setNewRule] = useState({ hostname: '', service: '' });

  const fetchRules = async () => {
    try {
      const data = await tunnelApi.getRules();
      setRules(data);
    } catch (error) {
      // Error is handled by API interceptor
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleAdd = async () => {
    if (!newRule.hostname.trim() || !newRule.service.trim()) return;
    setLoading(true);
    try {
      await tunnelApi.updateRule(newRule);
      setNewRule({ hostname: '', service: '' });
      setIsAddOpen(false);
      toastEmitter.emit('规则添加成功', 'success');
      await fetchRules();
    } catch (error) {
      // Error is handled by API interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (hostname: string) => {
    try {
      await tunnelApi.deleteRule(hostname);
      toastEmitter.emit('规则删除成功', 'success');
      await fetchRules();
    } catch (error) {
      // Error is handled by API interceptor
    }
  };

  const openExternal = (hostname: string) => {
    const url = hostname.startsWith('http') ? hostname : `https://${hostname}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Tunnel</h1>
            <p className="text-xs text-muted-foreground">{rules.length} 条规则</p>
          </div>
          <Button
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="gap-1.5 h-10 px-4 rounded-full shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">添加</span>
          </Button>
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center">
          <div className="w-full sm:max-w-md bg-background sm:rounded-2xl rounded-t-2xl border shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 duration-200">
            <div className="p-4">
              {/* Handle bar for mobile */}
              <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4 sm:hidden" />
              
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold">添加规则</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => {
                    setIsAddOpen(false);
                    setNewRule({ hostname: '', service: '' });
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium px-1">域名</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="example.com"
                      value={newRule.hostname}
                      onChange={(e) => setNewRule({ ...newRule, hostname: e.target.value })}
                      className="h-11 pl-10 rounded-xl"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium px-1">服务地址</label>
                  <div className="relative">
                    <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="http://localhost:8080"
                      value={newRule.service}
                      onChange={(e) => setNewRule({ ...newRule, service: e.target.value })}
                      className="h-11 pl-10 rounded-xl"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  className="flex-1 h-11 rounded-xl"
                  onClick={() => {
                    setIsAddOpen(false);
                    setNewRule({ hostname: '', service: '' });
                  }}
                >
                  取消
                </Button>
                <Button
                  className="flex-1 h-11 rounded-xl"
                  onClick={handleAdd}
                  disabled={loading || !newRule.hostname.trim() || !newRule.service.trim()}
                >
                  {loading ? '添加中...' : '添加'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="p-3">
        {rules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-5">
              <Globe className="w-10 h-10" />
            </div>
            <p className="text-base font-medium">暂无 Tunnel 规则</p>
            <p className="text-sm mt-1.5">点击右上角按钮添加</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="group bg-card border rounded-2xl p-4 active:scale-[0.99] transition-all duration-150 shadow-sm"
              >
                {/* Hostname */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[15px] truncate">
                      {rule.hostname}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg flex-shrink-0"
                    onClick={() => openExternal(rule.hostname)}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Service */}
                <div className="flex items-center gap-2 px-1 mb-3">
                  <Server className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground truncate">
                    {rule.service}
                  </p>
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground">运行中</span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(rule.hostname)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom padding for mobile */}
      <div className="h-4" />
    </div>
  );
}
