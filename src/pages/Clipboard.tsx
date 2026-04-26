import { useEffect, useState, useRef } from 'react';
import { clipboardApi, type Clip } from '@/api/clipboard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Copy, Plus, X, Clock } from 'lucide-react';
import { format } from '@/lib/utils';
import { toastEmitter } from '@/api/client';

export function ClipboardPage() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [newContent, setNewContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInputOpen, setIsInputOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchClips = async () => {
    try {
      const data = await clipboardApi.getAll();
      setClips(data);
    } catch (error) {
      // Error is handled by API interceptor
    }
  };

  useEffect(() => {
    fetchClips();
  }, []);

  useEffect(() => {
    if (isInputOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isInputOpen]);

  const handleCreate = async () => {
    if (!newContent.trim()) return;
    setLoading(true);
    try {
      await clipboardApi.create({ content: newContent });
      setNewContent('');
      setIsInputOpen(false);
      toastEmitter.emit('剪贴板创建成功', 'success');
      await fetchClips();
    } catch (error) {
      // Error is handled by API interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await clipboardApi.delete(id);
      toastEmitter.emit('剪贴板删除成功', 'success');
      await fetchClips();
    } catch (error) {
      // Error is handled by API interceptor
    }
  };

  const handleCopy = async (content: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // 使用现代 Clipboard API（HTTPS 环境）
        await navigator.clipboard.writeText(content);
        toastEmitter.emit('内容已复制到剪贴板', 'success');
      } else {
        // 使用传统方法作为后备（HTTP 环境）
        const textArea = document.createElement('textarea');
        textArea.value = content;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (success) {
          toastEmitter.emit('内容已复制到剪贴板', 'success');
        } else {
          throw new Error('复制失败');
        }
      }
    } catch (error) {
      toastEmitter.emit('复制失败', 'error');
    }
  };

  return (
    <div className="min-h-full bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">剪贴板</h1>
            <p className="text-xs text-muted-foreground">{clips.length} 条记录</p>
          </div>
          <Button
            size="sm"
            onClick={() => setIsInputOpen(true)}
            className="gap-1.5 h-10 px-4 rounded-full shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">新建</span>
          </Button>
        </div>
      </div>

      {/* Input Modal */}
      {isInputOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center">
          <div className="w-full sm:max-w-md bg-background sm:rounded-2xl rounded-t-2xl border shadow-2xl animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 duration-200">
            <div className="p-4">
              {/* Handle bar for mobile */}
              <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4 sm:hidden" />
              
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold">新建剪贴板</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => {
                    setIsInputOpen(false);
                    setNewContent('');
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <Textarea
                ref={textareaRef}
                placeholder="输入内容..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={5}
                className="resize-none mb-4 text-base rounded-xl"
              />
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-11 rounded-xl"
                  onClick={() => {
                    setIsInputOpen(false);
                    setNewContent('');
                  }}
                >
                  取消
                </Button>
                <Button
                  className="flex-1 h-11 rounded-xl"
                  onClick={handleCreate}
                  disabled={loading || !newContent.trim()}
                >
                  {loading ? '添加中...' : '添加'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content List */}
      <div className="p-3">
        {clips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-5">
              <ClipboardIcon className="w-10 h-10" />
            </div>
            <p className="text-base font-medium">暂无剪贴板内容</p>
            <p className="text-sm mt-1.5">点击右上角按钮添加</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clips.map((clip) => (
              <div
                key={clip.id}
                className="group bg-card border rounded-2xl p-4 active:scale-[0.99] transition-all duration-150 shadow-sm"
              >
                {/* Content */}
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words mb-3">
                  {clip.content}
                </p>
                
                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{format(new Date(clip.created_at))}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl"
                      onClick={() => handleCopy(clip.content)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(clip.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
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

// Simple clipboard icon component
function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
