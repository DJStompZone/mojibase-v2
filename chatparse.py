def tran_chr(s):
  return (ord(s[0]) if len(s) > 1 else ord(s))+4864

def tran_str(ss):
  return [tran_chr(ea) for ea in ss]

def tec_chr(c):
  return (chr(c[0]) if len(c) > 1 else chr(c))-4864

def tec_str(ary):
  return ''.join([tec_chr(ea) for ea in ary])
  